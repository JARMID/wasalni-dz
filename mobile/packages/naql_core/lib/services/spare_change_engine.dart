import '../models/ledger_entry.dart';

/// Result of a physical cash transaction with digital Spare Change resolution.
class SpareChangeSettlement {
  final String rideId;
  final double tenderedDzd;
  final double fareDzd;
  final double changeDueDzd;
  final double cashReturnedDzd;
  final double digitalCreditDzd;
  final LedgerEntry ledgerEntry;
  final DateTime timestamp;

  const SpareChangeSettlement({
    required this.rideId,
    required this.tenderedDzd,
    required this.fareDzd,
    required this.changeDueDzd,
    required this.cashReturnedDzd,
    required this.digitalCreditDzd,
    required this.ledgerEntry,
    required this.timestamp,
  });
}

/// Double-entry Spare Change Flywheel Engine.
/// Resolves small change shortages in Algeria without disputes by converting missing coins into digital credit.
class SpareChangeEngine {
  /// Resolves the transaction and generates corresponding double-entry accounting records.
  static SpareChangeSettlement settle({
    required String rideId,
    required double tenderedDzd,
    required double fareDzd,
    required double cashReturnedDzd,
    DateTime? timestamp,
  }) {
    final now = timestamp ?? DateTime.now();
    final changeDue = tenderedDzd > fareDzd ? tenderedDzd - fareDzd : 0.0;
    final digitalCredit = changeDue > cashReturnedDzd ? changeDue - cashReturnedDzd : 0.0;

    // Account 1020: Digital Escrow Reserve (Asset) -> Account 2010: Rider TrustDesk Wallet (Liability)
    final entry = LedgerEntry(
      id: 'SPARE-${now.millisecondsSinceEpoch}',
      timestamp: now.toIso8601String(),
      entryType: 'SPARE_CHANGE_ROUNDUP',
      debitAccount: '1020_DIGITAL_ESCROW',
      creditAccount: '2010_RIDER_TRUSTDESK',
      amountDzd: digitalCredit,
      description: 'Spare change credit from cash fare on ride $rideId',
      rideId: rideId,
    );

    return SpareChangeSettlement(
      rideId: rideId,
      tenderedDzd: tenderedDzd,
      fareDzd: fareDzd,
      changeDueDzd: changeDue,
      cashReturnedDzd: cashReturnedDzd,
      digitalCreditDzd: digitalCredit,
      ledgerEntry: entry,
      timestamp: now,
    );
  }
}
