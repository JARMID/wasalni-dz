"""
Unit tests for BaridiMob OCR receipt parser, RIP checksum calculator, and settlement engine.
"""

import unittest
from parser import calculate_algerian_rip_key, verify_algerian_rip, parse_baridimob_text
from verifier import BaridiMobSettlementEngine


class TestBaridiMobVerifier(unittest.TestCase):
    def test_rip_checksum_calculation(self):
        # Sample CCP account: 0012345678
        # Formula: 97 - ((12345678 * 100) % 97)
        expected_key = calculate_algerian_rip_key("0012345678")
        self.assertEqual(len(expected_key), 2)
        
        # Verify valid full RIP
        full_rip = f"007999990012345678{expected_key}"
        self.assertTrue(verify_algerian_rip(full_rip))

    def test_parse_typical_baridimob_receipt(self):
        sample_receipt = """
        Algérie Poste - BaridiMob
        Reçu de Virement
        Référence de transaction: TXN-DZ-884912
        Date: 14/10/2026 17:42:10
        Compte Émetteur: 00799999001234567825
        Compte Destinataire: 00799999009876543210
        Montant débité: 2 500,00 DA
        Statut: Opération Réussie
        """

        receipt = parse_baridimob_text(sample_receipt)
        self.assertIsNotNone(receipt)
        self.assertEqual(receipt.transaction_id, "TXN-DZ-884912")
        self.assertEqual(receipt.amount_dzd, 2500.0)
        self.assertEqual(receipt.timestamp, "14/10/2026 17:42:10")

    def test_duplicate_prevention_replay_guard(self):
        engine = BaridiMobSettlementEngine()
        sample_receipt = """
        BaridiMob Algérie Poste
        Réf: TXN-UNIQUE-999
        Montant: 1500 DA
        Date: 14/10/2026 18:00:00
        Compte: 00799999001234567800
        """

        # First settlement should succeed
        res1 = engine.verify_and_credit_wallet(
            receipt_text=sample_receipt,
            target_wallet_id="WLT-DRV-16",
            account_type="driver_operational",
        )
        self.assertTrue(res1["success"])
        self.assertEqual(res1["ledger_entry"]["amount_dzd"], 1500.0)

        # Replay attempt with same receipt text should be blocked
        res2 = engine.verify_and_credit_wallet(
            receipt_text=sample_receipt,
            target_wallet_id="WLT-DRV-16",
            account_type="driver_operational",
        )
        self.assertFalse(res2["success"])
        self.assertEqual(res2["error"], "DUPLICATE_TRANSACTION")


if __name__ == "__main__":
    unittest.main()
