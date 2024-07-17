package com.example.projectPfe.Services;

import com.example.projectPfe.dto.MailBody;
import com.example.projectPfe.models.Adherant;
import com.example.projectPfe.models.Beneficiaire;
import com.example.projectPfe.models.Prestation;
import com.example.projectPfe.models.Utilisateur;
import com.example.projectPfe.repository.BeneficiairRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Date;


@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    private final BeneficiairRepository beneficiairRepository;


    public EmailService(JavaMailSender javaMailSender, TemplateEngine templateEngine, BeneficiairRepository beneficiairRepository) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.beneficiairRepository = beneficiairRepository;
    }

    public void sendSimpleMessage(MailBody mailBody){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("doghman.moetaz@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());

        javaMailSender.send(message);
    }

    public void sendEmailWithHtmlTemplate(MailBody mailBody, String templateName, Context context) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            ClassPathResource imageResource = new ClassPathResource("/static/images/logo.png");
            message.addInline("logo", imageResource);

            message.setTo(mailBody.to());
            message.setFrom("doghman.moetaz@gmail.com");
            message.setSubject(mailBody.subject());

            String htmlContent = templateEngine.process(templateName, context);
            message.setText(htmlContent, true);
           javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
        }
    }

    public void sendContreVisiteEmail(String recipientEmail, Prestation prestation) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            ClassPathResource imageResource = new ClassPathResource("/static/images/logo.png");
            message.addInline("logo", imageResource);

            message.setTo(recipientEmail);
            message.setFrom("doghman.moetaz@gmail.com");
            message.setSubject("Contre-visite requise");

            Context context = new Context();
            Adherant adherant = prestation.getAdherant();
            context.setVariable("adherantNom", adherant != null ? adherant.getNom() : null);
            context.setVariable("adherantPrenom", adherant != null ? adherant.getPrenom() : null);
            context.setVariable("adherantDateNais", adherant != null ? adherant.getDateNais() : null);

            Date currentDate = new Date();
            context.setVariable("currentDate", currentDate);

            String beneficiaireId = prestation.getBeneficiaireId();
            if (beneficiaireId != null) {
                Beneficiaire beneficiaire = beneficiairRepository.findById(Integer.parseInt(beneficiaireId))
                        .orElseThrow(() -> new EntityNotFoundException("Beneficiaire not found with id: " + beneficiaireId));
                context.setVariable("beneficiaireNom", beneficiaire.getNom());
                context.setVariable("beneficiairePrenom", beneficiaire.getPrenom());
                context.setVariable("beneficiaireSexe", beneficiaire.getSexe());
                context.setVariable("beneficiaireDateNais", beneficiaire.getDateNais());
                context.setVariable("beneficiaireQualite", beneficiaire.getQualite());
            }

            String htmlContent = templateEngine.process("templateCv", context);
            message.setText(htmlContent, true);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendPrestationDetailsEmailForAdherant(String recipientEmail, Utilisateur user) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            ClassPathResource imageResource = new ClassPathResource("/static/images/logo.png");
            message.addInline("logo", imageResource);

            message.setTo(recipientEmail);
            message.setFrom("doghman.moetaz@gmail.com");
            message.setSubject("Votre prestation nécessite une contre-visite");

            Context context = new Context();
            Date currentDate = new Date();
            context.setVariable("currentDate", currentDate);

            context.setVariable("userNom", user.getNom());
            context.setVariable("userPrenom", user.getPrenom());
            context.setVariable("userAdresse", user.getAdresse());
            context.setVariable("userTel", user.getTel());

            // Processus du template HTML
            String htmlContent = templateEngine.process("prestation-details-email", context);
            message.setText(htmlContent, true);

            // Envoyer l'e-mail
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }





}
