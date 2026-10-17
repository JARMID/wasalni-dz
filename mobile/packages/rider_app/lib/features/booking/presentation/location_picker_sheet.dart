import 'package:flutter/material.dart';
import 'package:naql_core/naql_core.dart';

/// Modal bottom sheet allowing riders to select an Algiers transportation hub.
class LocationPickerSheet extends StatelessWidget {
  const LocationPickerSheet({
    super.key,
    required this.isOrigin,
    required this.isArabic,
    required this.onSelectHub,
  });

  final bool isOrigin;
  final bool isArabic;
  final ValueChanged<GeoHub> onSelectHub;

  static void show(
    BuildContext context, {
    required bool isOrigin,
    required bool isArabic,
    required ValueChanged<GeoHub> onSelectHub,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF131D31),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => LocationPickerSheet(
        isOrigin: isOrigin,
        isArabic: isArabic,
        onSelectHub: onSelectHub,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isOrigin
                  ? (isArabic ? 'مكان الانطلاق' : 'Lieu de prise en charge')
                  : (isArabic ? 'وجهة الوصول' : 'Destination d\'arrivée'),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 16),
            Flexible(
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: GeoRoutingService.algiersHubs.length,
                separatorBuilder: (_, __) => const Divider(color: Colors.white10),
                itemBuilder: (ctx, i) {
                  final hub = GeoRoutingService.algiersHubs[i];
                  return ListTile(
                    dense: true,
                    leading: Icon(
                      isOrigin ? Icons.my_location : Icons.location_on,
                      color: isOrigin ? const Color(0xFF0EA5E9) : const Color(0xFFF59E0B),
                      size: 20,
                    ),
                    title: Text(
                      hub.localizedName(isArabic),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    subtitle: Text(
                      hub.commune,
                      style: const TextStyle(color: Colors.white54, fontSize: 11),
                    ),
                    trailing: Text(
                      '${hub.lat.toStringAsFixed(2)}, ${hub.lng.toStringAsFixed(2)}',
                      style: const TextStyle(
                        color: Colors.white38,
                        fontSize: 10,
                        fontFamily: 'monospace',
                      ),
                    ),
                    onTap: () {
                      onSelectHub(hub);
                      Navigator.pop(ctx);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
