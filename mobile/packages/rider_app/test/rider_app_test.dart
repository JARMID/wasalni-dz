import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rider_app/main.dart';

void main() {
  testWidgets('RiderApp renders 3 transport modes and requests taxi', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(400, 850);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const RiderApp());
    await tester.pumpAndSettle();

    // Verify header and initial wallet balance
    expect(find.text('NAQL DZ'), findsWidgets);
    expect(find.text('1450 DA'), findsOneWidget);

    // Verify 3 Algerian transport modes
    expect(find.textContaining('Taxi Individuel'), findsOneWidget);
    expect(find.textContaining('Taxi Collectif Urbain'), findsOneWidget);
    expect(find.textContaining('Taxi Inter-Wilaya'), findsOneWidget);

    // Verify Order button
    expect(find.text('Commander un Taxi Certifié'), findsOneWidget);

    // Tap order button
    await tester.tap(find.text('Commander un Taxi Certifié'));
    await tester.pumpAndSettle();

    // Verify transition to assigned trip screen with driver info and PIN
    expect(find.textContaining('Chauffeur en route'), findsOneWidget);
    expect(find.text('Mohamed Brahimi'), findsOneWidget);
    expect(find.text('Code PIN d\'embarquement:'), findsOneWidget);
  });
}
