import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:naql_core/naql_core.dart';
import 'package:driver_app/main.dart';

void main() {
  testWidgets('DriverCockpitApp renders regulatory credentials and HUD', (WidgetTester tester) async {
    // Set fixed landscape-like tablet size for testing
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const DriverCockpitApp());
    await tester.pumpAndSettle();

    // Verify regulatory badges and driver info
    expect(find.text('WASSLANI'), findsWidgets);
    expect(find.text('Mohamed Brahimi'), findsOneWidget);
    expect(find.textContaining('16/AGR/2021/0894'), findsOneWidget);
    expect(find.textContaining('DÉCRET EXÉCUTIF 12-230'), findsOneWidget);

    // Verify CameraX HUD presence
    expect(find.textContaining('CameraX Circular Buffer'), findsOneWidget);
    expect(find.text('Crash 2.84G'), findsOneWidget);

    // Tap the Crash 2.84G lockbox simulation button
    await tester.tap(find.text('Crash 2.84G'));
    await tester.pump();

    // Verify Shamir 2-of-3 lockbox trigger snackbar appears
    expect(find.textContaining('ALERTE 2.84G: Buffer 60s verrouillé sous AES-256-GCM'), findsOneWidget);
  });

  testWidgets('DriverCockpitApp toggles Arabic and displays Arabic HUD and regulatory titles', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const DriverCockpitApp());
    await tester.pumpAndSettle();

    // Find and tap Arabic toggle
    final langToggle = find.text('عربي');
    expect(langToggle, findsOneWidget);
    await tester.tap(langToggle);
    await tester.pumpAndSettle();

    // Verify Arabic regulatory badges
    expect(find.textContaining('المرسوم التنفيذي 12-230'), findsOneWidget);
    expect(find.text('مطابق'), findsOneWidget);
    expect(find.text('في انتظار طلبات الركاب...'), findsOneWidget);
  });

  testWidgets('DriverCockpitApp opens Z-Report and Boite Noire dialogs', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const DriverCockpitApp());
    await tester.pumpAndSettle();

    // Tap Z-Report button in AppBar
    final zReportFinder = find.text('Z-Report');
    expect(zReportFinder, findsOneWidget);
    await tester.tap(zReportFinder);
    await tester.pumpAndSettle();

    // Verify Z-Report modal contents
    expect(find.textContaining('Rapport de Quart (Z-Report)'), findsOneWidget);
    expect(find.textContaining('Courses réalisées'), findsOneWidget);
    expect(find.textContaining('74.5 km'), findsOneWidget);

    // Close Z-Report dialog
    await tester.tap(find.text('Fermer'));
    await tester.pumpAndSettle();

    // Open Boîte Noire dialog
    final boiteNoireFinder = find.textContaining('Boîte Noire');
    expect(boiteNoireFinder, findsOneWidget);
    await tester.tap(boiteNoireFinder);
    await tester.pumpAndSettle();

    // Verify Boîte Noire modal
    expect(find.textContaining('Boîte Noire Judiciaire'), findsOneWidget);
  });

  testWidgets('DriverCockpitApp opens Agrément compliance dialog and tests navigation flow', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const DriverCockpitApp());
    await tester.pumpAndSettle();

    // Verify Agrément button in AppBar and open it
    final agrementButton = find.text('Agrément');
    expect(agrementButton, findsOneWidget);
    await tester.tap(agrementButton);
    await tester.pumpAndSettle();

    // Verify compliance dialog details
    expect(find.textContaining('Conformité Réglementaire Véhicule'), findsOneWidget);
    expect(find.textContaining('LP-16-44021'), findsOneWidget);
    expect(find.textContaining('SAA Multirisques'), findsOneWidget);

    // Close compliance dialog
    await tester.tap(find.text('Fermer'));
    await tester.pumpAndSettle();

    // Simulate new ride request
    final simFinder = find.text('Simuler une Demande Passager');
    expect(simFinder, findsOneWidget);
    await tester.tap(simFinder);
    await tester.pumpAndSettle();

    // Accept ride
    final acceptFinder = find.text('Accepter la Course');
    expect(acceptFinder, findsOneWidget);
    await tester.tap(acceptFinder);
    await tester.pumpAndSettle();

    // Arrive on place
    final arriveFinder = find.text('Je suis Arrivé sur Place');
    expect(arriveFinder, findsOneWidget);
    await tester.tap(arriveFinder);
    await tester.pumpAndSettle();

    // Start trip
    final startFinder = find.text('Démarrer la Course');
    expect(startFinder, findsOneWidget);
    await tester.tap(startFinder);
    await tester.pumpAndSettle();

    // Verify navigation banner is active with speed limit and road name
    expect(find.textContaining('Rejoindre la Rocade Sud'), findsOneWidget);
    expect(find.text('80'), findsOneWidget);
  });

  testWidgets('DriverCockpitApp synchronizes driver operational balance and records crash lockbox', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    bool dashcamIncidentUploaded = false;
    final mockClient = MockClient((request) async {
      if (request.url.path == '/rest/v1/wallets') {
        final responsePayload = [
          {'system_account_code': '2020', 'balance_dzd': '5200.00'},
        ];
        return http.Response(jsonEncode(responsePayload), 200, headers: {'content-type': 'application/json'});
      }
      if (request.url.path == '/rest/v1/dashcam_incidents') {
        dashcamIncidentUploaded = true;
        return http.Response(jsonEncode([{'id': '00000000-0000-0000-0000-000000000001'}]), 201, headers: {'content-type': 'application/json'});
      }
      return http.Response('[]', 200);
    });

    final testService = SupabaseService(client: mockClient);
    addTearDown(testService.dispose);

    await tester.pumpWidget(DriverCockpitApp(supabaseService: testService));
    await tester.pumpAndSettle();

    // Verify synchronized operational balance 5200 DA appears
    expect(find.text('5200 DA'), findsOneWidget);

    // Trigger crash button
    await tester.tap(find.text('Crash 2.84G'));
    await tester.pumpAndSettle();

    expect(dashcamIncidentUploaded, isTrue);
  });
}
