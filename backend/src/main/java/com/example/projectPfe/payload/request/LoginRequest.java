package com.example.projectPfe.payload.request;

import lombok.NonNull;

public class LoginRequest {
    @NonNull
    private String email;

    @NonNull
    private String password;

    public String getEmail() {
        return email;
    }

    public void setUsername(String username) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

