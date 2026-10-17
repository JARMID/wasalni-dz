import 'package:flutter/material.dart';

/// Live chat dialog between driver and passenger with quick dispatch chips.
class DriverChatDialog extends StatefulWidget {
  const DriverChatDialog({
    super.key,
    required this.isArabic,
  });

  final bool isArabic;

  static void show(BuildContext context, {required bool isArabic}) {
    showDialog(
      context: context,
      builder: (ctx) => DriverChatDialog(isArabic: isArabic),
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
      },
      {
        'sender': 'rider',
        'text': widget.isArabic
            ? 'وعليكم السلام، ممتاز أنا بانتظارك عند المدخل.'
            : 'Salam, parfait je vous attends devant la sortie.',
        'time': '16:43',
      },
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

    return Directionality(
      textDirection: isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: AlertDialog(
        backgroundColor: const Color(0xFF131B29),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Color(0xFFF59E0B),
              radius: 16,
              child: Icon(Icons.person, color: Colors.black, size: 18),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                isArabic ? 'محادثة مباشرة مع الراكب' : 'Chat Passager en Direct',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.close, size: 18),
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
        content: SizedBox(
          width: 400,
          height: 340,
          child: Column(
            children: [
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    'راني في الطريق',
                    'راني قدام الباب',
                    'زحمة سير في باش جراح',
                    'J\'arrive dans 2 minutes',
                  ]
                      .map((chip) => Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: ActionChip(
                              backgroundColor: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                              side: BorderSide(
                                color: const Color(0xFFF59E0B).withValues(alpha: 0.3),
                              ),
                              label: Text(
                                chip,
                                style: const TextStyle(fontSize: 10, color: Color(0xFFF59E0B)),
                              ),
                              onPressed: () {
                                setState(() {
                                  _chatMessages.add({
                                    'sender': 'driver',
                                    'text': chip,
                                    'time': '16:44',
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
                    final isDriver = msg['sender'] == 'driver';
                    return Align(
                      alignment: isDriver ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDriver ? const Color(0xFFF59E0B) : const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Text(
                          msg['text'] ?? '',
                          style: TextStyle(
                            fontSize: 12,
                            color: isDriver ? Colors.black : Colors.white,
                            fontWeight: isDriver ? FontWeight.w600 : FontWeight.normal,
                          ),
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
                    icon: const Icon(Icons.send, color: Color(0xFFF59E0B)),
                    onPressed: () {
                      if (_chatController.text.trim().isNotEmpty) {
                        setState(() {
                          _chatMessages.add({
                            'sender': 'driver',
                            'text': _chatController.text.trim(),
                            'time': '16:45',
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
