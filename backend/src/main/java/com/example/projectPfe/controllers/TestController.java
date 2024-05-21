package com.example.projectPfe.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('ROLE_DENTIST') or hasRole('ROLE_OPTICIEN') or hasRole('ROLE_ADMIN')")
    public String userAccess() {
        return "pharmacien  Content.";

    }

    @GetMapping("/opt")
    @PreAuthorize("hasRole('ROLE_DENTIST') or hasRole('ROLE_OPTICIEN')")
    public String moderatorAccess() {
        return "opticien Board";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }
}
