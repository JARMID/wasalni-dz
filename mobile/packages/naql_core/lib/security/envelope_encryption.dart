import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';

/// Cryptographic envelope encryption and Shamir Secret Sharing (2-of-3)
/// for judicial incident lockbox compliance under Algerian Law 25-11.
class EnvelopeEncryption {
  static final Random _rng = Random.secure();

  /// Generates a random 256-bit Data Encryption Key (DEK).
  static List<int> generateDek() {
    return List<int>.generate(32, (_) => _rng.nextInt(256));
  }

  /// Splits a 256-bit secret into 3 Shamir shares where any 2 can reconstruct.
  /// Uses a degree-1 polynomial over finite field GF(256).
  static List<ShamirShare> splitShamir2of3(List<int> secretBytes) {
    final randomSlopeA = List<int>.generate(secretBytes.length, (_) => _rng.nextInt(256));

    final shares = <ShamirShare>[];

    // Evaluate f(x) = secret + a * x over GF(256) for x in {1, 2, 3}
    for (int x = 1; x <= 3; x++) {
      final yValues = List<int>.generate(secretBytes.length, (i) {
        return (secretBytes[i] ^ _gfMultiply(randomSlopeA[i], x)) & 0xFF;
      });
      shares.add(ShamirShare(
        index: x,
        threshold: 2,
        totalShares: 3,
        shareHex: _bytesToHex(yValues),
      ));
    }

    return shares;
  }

  /// Reconstructs the 256-bit secret given any 2 distinct shares.
  static List<int> combineShamir2of3(ShamirShare s1, ShamirShare s2) {
    if (s1.index == s2.index) {
      throw ArgumentError('Shares must have distinct x-indices');
    }

    final bytes1 = _hexToBytes(s1.shareHex);
    final bytes2 = _hexToBytes(s2.shareHex);
    final x1 = s1.index;
    final x2 = s2.index;

    // Lagrange basis evaluation at x = 0:
    // f(0) = y1 * (x2 / (x2 - x1)) + y2 * (x1 / (x1 - x2))
    final secret = List<int>.generate(bytes1.length, (i) {
      final term1 = _gfMultiply(bytes1[i], _gfDivide(x2, x2 ^ x1));
      final term2 = _gfMultiply(bytes2[i], _gfDivide(x1, x1 ^ x2));
      return (term1 ^ term2) & 0xFF;
    });

    return secret;
  }

  /// Calculates an incident fingerprint using SHA-256.
  static String calculateFingerprint(String incidentId, DateTime timestamp, double peakG) {
    final payload = '$incidentId:${timestamp.toIso8601String()}:$peakG';
    return sha256.convert(utf8.encode(payload)).toString();
  }

  // --- Galois Field GF(2^8) Arithmetic Helpers with Rijndael polynomial 0x11B ---

  static int _gfMultiply(int a, int b) {
    int p = 0;
    int curA = a;
    int curB = b;
    for (int counter = 0; counter < 8; counter++) {
      if ((curB & 1) != 0) {
        p ^= curA;
      }
      final hiBitSet = (curA & 0x80) != 0;
      curA = (curA << 1) & 0xFF;
      if (hiBitSet) {
        curA ^= 0x1B;
      }
      curB >>= 1;
    }
    return p;
  }

  static int _gfPow(int base, int exp) {
    int res = 1;
    int b = base;
    int e = exp;
    while (e > 0) {
      if ((e & 1) != 0) {
        res = _gfMultiply(res, b);
      }
      b = _gfMultiply(b, b);
      e >>= 1;
    }
    return res;
  }

  static int _gfDivide(int a, int b) {
    if (b == 0) throw ArgumentError('Division by zero in GF(256)');
    if (a == 0) return 0;
    final inv = _gfPow(b, 254);
    return _gfMultiply(a, inv);
  }


  static String _bytesToHex(List<int> bytes) {
    return bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
  }

  static List<int> _hexToBytes(String hex) {
    final result = <int>[];
    for (int i = 0; i < hex.length; i += 2) {
      result.add(int.parse(hex.substring(i, i + 2), radix: 16));
    }
    return result;
  }
}

class ShamirShare {
  const ShamirShare({
    required this.index,
    required this.threshold,
    required this.totalShares,
    required this.shareHex,
  });

  final int index; // 1 = Device, 2 = Legal Escrow, 3 = Compliance KMS
  final int threshold;
  final int totalShares;
  final String shareHex;

  Map<String, dynamic> toJson() => {
    'index': index,
    'threshold': threshold,
    'totalShares': totalShares,
    'shareHex': shareHex,
  };
}
