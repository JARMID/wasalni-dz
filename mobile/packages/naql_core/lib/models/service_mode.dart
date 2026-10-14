/// Regulated transport service modes under Algerian Executive Decree 12-230
/// and CNRC activity code 604103.
enum ServiceMode {
  /// Mode 1: Individual metered taxi with mandatory 100 DA approach fee
  taxiIndividuel(
    id: 'taxi_individuel_metered',
    displayNameFr: 'Taxi Individuel (Compteur)',
    displayNameAr: 'طاقسي فردي (عداد)',
    approachFeeDzd: 100.0,
    baseSeatCount: 4,
  ),

  /// Mode 2: Urban collective taxi at 50 DA per passenger seat (4 seats)
  taxiCollectifUrbain(
    id: 'taxi_collectif_urbain',
    displayNameFr: 'Taxi Collectif Urbain (Ligne)',
    displayNameAr: 'طاقسي جماعي حضري',
    approachFeeDzd: 0.0,
    baseSeatCount: 4,
    fixedSeatPriceDzd: 50.0,
  ),

  /// Mode 3: Inter-wilaya collective taxi operating from Gare Routière Caroubier
  taxiInterWilaya(
    id: 'taxi_inter_wilaya',
    displayNameFr: 'Taxi Inter-Wilaya (Gare Caroubier)',
    displayNameAr: 'طاقسي ما بين الولايات (الخروبة)',
    approachFeeDzd: 0.0,
    baseSeatCount: 7,
  );

  const ServiceMode({
    required this.id,
    required this.displayNameFr,
    required this.displayNameAr,
    required this.approachFeeDzd,
    required this.baseSeatCount,
    this.fixedSeatPriceDzd,
  });

  final String id;
  final String displayNameFr;
  final String displayNameAr;
  final double approachFeeDzd;
  final int baseSeatCount;
  final double? fixedSeatPriceDzd;

  static ServiceMode fromId(String id) {
    return ServiceMode.values.firstWhere(
      (m) => m.id == id,
      orElse: () => ServiceMode.taxiIndividuel,
    );
  }
}
