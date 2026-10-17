import 'package:flutter/material.dart';

/// Interactive chat dialog between rider and driver with quick response chips.
class DriverChatDialog extends StatefulWidget {
  const DriverChatDialog({
    super.key,
    required this.driverName,
    required this.vehiclePlate,
    required this.isArabic,
  });

  final String driverName;
  final String vehiclePlate;
  final bool isArabic;

  static void show(
    BuildContext context, {
    required String driverName,
    required String vehiclePlate,
    required bool isArabic,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => DriverChatDialog(
        driverName: driverName,
        vehiclePlate: vehiclePlate,
        isArabic: isArabic,
      ),
    );
  }

  @override
  State<DriverChatDialog> createState() => _DriverChatDialogState();
}

class _DriverChatDialogState extends State<DriverChatDialog> {
  final TextEditingController _chatController = TextEditingController();
  late final List<Map<String, String>> _chatMessages;

  @override
  void initState() {
    super.initState();
    _chatMessages = [
      {
        'sender': 'driver',
        'text': widget.isArabic
            ? 'السلام عليكم! أنا في الطريق بسيارة بيجو 301.'
            : 'Salam Alikoum ! Je suis en route avec ma Peugeot 301.',
        'time': '16:42',
      }
    ];
  }

  @override
  void dispose() {
    _chatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isArabic = widget.isArabic;
    final driverName = widget.driverName;
    final plate = widget.vehiclePlate;

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131D31),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        titlePadding: const EdgeInsets.fromLTRB(20, 16, 16, 12),
        title: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Color(0xFF2563EB),
              radius: 18,
              child: Icon(Icons.person, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    driverName,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    plate,
                    style: const TextStyle(fontSize: 11, color: Colors.white54),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, size: 20),
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          height: 360,
          child: Column(
            children: [
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    'راني نستنى قدام الباب',
                    'Je suis devant l\'entrée',
                    'راني في إشارة المرور',
                    'Climatisation svp',
                  ]
                      .map((chip) => Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: ActionChip(
                              backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.15),
                              side: BorderSide(
                                color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                              ),
                              label: Text(
                                chip,
                                style: const TextStyle(fontSize: 10, color: Color(0xFF60A5FA)),
                              ),
                              onPressed: () {
                                setState(() {
                                  _chatMessages.add({
                                    'sender': 'rider',
                                    'text': chip,
                                    'time': '16:43',
                                  });
                                });
                              },
                            ),
                          ))
                      .toList(),
                ),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: ListView.builder(
                  itemCount: _chatMessages.length,
                  itemBuilder: (ctx, idx) {
                    final msg = _chatMessages[idx];
                    final isRider = msg['sender'] == 'rider';
                    return Align(
                      alignment: isRider ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isRider ? const Color(0xFF2563EB) : const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          msg['text'] ?? '',
                          style: const TextStyle(fontSize: 13, color: Colors.white),
                        ),
                      ),
                    );
                  },
                ),
              ),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _chatController,
                      decoration: InputDecoration(
                        hintText: isArabic ? 'اكتب رسالة...' : 'Écrire un message...',
                        hintStyle: const TextStyle(fontSize: 12, color: Colors.white38),
                        filled: true,
                        fillColor: const Color(0xFF0F172A),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding:
                            const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF2563EB)),
                    onPressed: () {
                      if (_chatController.text.trim().isNotEmpty) {
                        setState(() {
                          _chatMessages.add({
                            'sender': 'rider',
                            'text': _chatController.text.trim(),
                            'time': '16:44',
                          });
                          _chatController.clear();
                        });
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
