package com.example.projectPfe.dto;

import lombok.Builder;

@Builder
public record MailBody(String to , String subject, String text) {

}
