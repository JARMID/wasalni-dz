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
}
