import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
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
}
