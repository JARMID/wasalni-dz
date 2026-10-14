import 'package:meta/meta.dart';

/// Double-entry general ledger entry adhering to standard accounting equations:
/// Sum(Debits) = Sum(Credits).
@immutable
class LedgerEntry {
  const LedgerEntry({
    required this.id,
    required this.timestamp,
    required this.entryType,
    required this.debitAccount,
    required this.creditAccount,
    required this.amountDzd,
    required this.description,
    this.rideId,
  });

  final String id;
  final String timestamp;
  final String entryType;
  final String debitAccount;
  final String creditAccount;
  final double amountDzd;
  final String description;
  final String? rideId;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'timestamp': timestamp,
      'entryType': entryType,
      'debitAccount': debitAccount,
      'creditAccount': creditAccount,
      'amountDzd': amountDzd,
      'description': description,
      'rideId': rideId,
    };
  }
}
