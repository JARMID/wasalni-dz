import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:naql_core/naql_core.dart';
import 'package:rider_app/main.dart';

void main() {
  testWidgets('RiderApp renders 3 transport modes and requests taxi', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(450, 1000);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const RiderApp());
    await tester.pumpAndSettle();

    // Verify header and initial wallet balance
    expect(find.text('WASSLANI'), findsWidgets);
    expect(find.text('1450 DA'), findsOneWidget);

    // Verify 3 Algerian transport modes
    expect(find.textContaining('Taxi Individuel'), findsOneWidget);
    expect(find.textContaining('Taxi Collectif Urbain'), findsOneWidget);
    expect(find.textContaining('Taxi Inter-Wilaya'), findsOneWidget);

    // Verify Order button
    final orderFinder = find.text('Commander un Taxi Certifié');
    expect(orderFinder, findsOneWidget);

    // Tap order button
    await tester.ensureVisible(orderFinder);
    await tester.tap(orderFinder);
    await tester.pumpAndSettle();

    // Verify transition to assigned trip screen with driver info and PIN
    expect(find.textContaining('Chauffeur en route'), findsOneWidget);
    expect(find.text('Mohamed Brahimi'), findsOneWidget);
    expect(find.text('Code PIN d\'embarquement:'), findsOneWidget);
  });

  testWidgets('RiderApp toggles Arabic language and renders RTL texts', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(450, 1000);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const RiderApp());
    await tester.pumpAndSettle();

    // Find and tap language switch button (عربي)
    final langButton = find.text('عربي');
    expect(langButton, findsOneWidget);
    await tester.tap(langButton);
    await tester.pumpAndSettle();

    // Verify Arabic translations appear
    expect(find.text('الراكب'), findsOneWidget);
    expect(find.textContaining('تاكسي فردي'), findsOneWidget);
    expect(find.text('طلب سيارة'), findsOneWidget);
    expect(find.textContaining('المحفظة'), findsWidgets);
  });

  testWidgets('RiderApp renders favorite destinations and completes review flow', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(500, 1200);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const RiderApp());
    await tester.pumpAndSettle();

    // Verify favorite hubs appear
    expect(find.text('Aéroport T4'), findsOneWidget);
    expect(find.text('Alger Centre'), findsWidgets);
    expect(find.text('USTHB'), findsOneWidget);

    // Tap order button
    final orderFinder = find.text('Commander un Taxi Certifié');
    await tester.ensureVisible(orderFinder);
    await tester.tap(orderFinder);
    await tester.pumpAndSettle();

    // Verify maneuvers itinerary appears
    expect(find.textContaining('Itinéraire & Manœuvres'), findsOneWidget);

    // Tap 'Arrivée à Destination & Évaluer'
    final evalFinder = find.text('Arrivée à Destination & Évaluer');
    await tester.ensureVisible(evalFinder);
    await tester.tap(evalFinder);
    await tester.pumpAndSettle();

    // Verify rating dialog opened
    expect(find.textContaining('Évaluation de la Course'), findsOneWidget);
    expect(find.text('Respect du compteur légal'), findsOneWidget);

    // Tap submit rating
    final submitFinder = find.text('Envoyer l\'Avis');
    await tester.tap(submitFinder);
    await tester.pumpAndSettle();

    // Returned to idle booking screen
    expect(find.text('Commander un Taxi Certifié'), findsOneWidget);
  });

  testWidgets('RiderApp synchronizes live wallet balance from SupabaseService', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(450, 1000);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    final mockClient = MockClient((request) async {
      final responsePayload = [
        {'system_account_code': '2010', 'balance_dzd': '2850.00'},
      ];
      return http.Response(jsonEncode(responsePayload), 200, headers: {
        'content-type': 'application/json',
      });
    });

    final testService = SupabaseService(client: mockClient);
    addTearDown(testService.dispose);

    await tester.pumpWidget(RiderApp(supabaseService: testService));
    await tester.pumpAndSettle();

    // Verify synchronized balance 2850 DA is displayed in top header
    expect(find.text('2850 DA'), findsOneWidget);

    // Switch to Wallet tab via bottom bar icon
    final walletTabFinder = find.byIcon(Icons.wallet);
    await tester.tap(walletTabFinder);
    await tester.pumpAndSettle();

    // Verify synchronized balance 2850 DA is displayed in the hero card
    expect(find.text('2850 DA'), findsWidgets);
  });
}
