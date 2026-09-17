package com.starttostar.backend.controller;

import com.starttostar.backend.entity.User;
import com.starttostar.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email and password are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (userService.existsByEmail(user.getEmail().trim())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "An account with this email already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        user.setEmail(user.getEmail().trim().toLowerCase());
        User savedUser = userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // GET ALL USERS
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email and password are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User loggedInUser = userService.login(
            user.getEmail().trim().toLowerCase(),
            user.getPassword()
        );

        if (loggedInUser != null) {
            return ResponseEntity.ok(loggedInUser);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}