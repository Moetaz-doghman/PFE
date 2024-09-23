package com.example.projectPfe.Exceptions;

public class BordereauNotFoundException extends RuntimeException {

    public BordereauNotFoundException(String message) {
        super(message);
    }

    public BordereauNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }


}
