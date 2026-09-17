package com.starttostar.backend.controller;

import com.starttostar.backend.entity.Message;
import com.starttostar.backend.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // SEND MESSAGE
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        if (message.getSenderEmail() == null || message.getReceiverEmail() == null || message.getContent() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Sender email, receiver email, and content are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        Message saved = messageService.sendMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET USER MESSAGES
    @GetMapping("/{email}")
    public ResponseEntity<List<Message>> getUserMessages(@PathVariable String email) {
        return ResponseEntity.ok(messageService.getUserMessages(email));
    }

    // GET ALL MESSAGES
    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    // DELETE MESSAGE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        boolean deleted = messageService.deleteMessage(id);
        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("message", "Message deleted successfully");
            response.put("id", id);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Message not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}