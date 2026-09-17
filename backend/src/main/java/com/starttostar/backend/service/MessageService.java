package com.starttostar.backend.service;

import com.starttostar.backend.entity.Message;
import com.starttostar.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // SEND MESSAGE
    public Message sendMessage(Message message) {
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(LocalDateTime.now());
        }
        if (message.getIsRead() == null) {
            message.setIsRead(false);
        }
        return messageRepository.save(message);
    }

    // GET USER MESSAGES
    public List<Message> getUserMessages(String email) {
        return messageRepository.findBySenderEmailOrReceiverEmailOrderByCreatedAtAsc(
                email,
                email
        );
    }

    // GET ALL MESSAGES
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // DELETE MESSAGE
    public boolean deleteMessage(Long id) {
        if (messageRepository.existsById(id)) {
            messageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}