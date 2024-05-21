package com.example.projectPfe.Services;

import com.example.projectPfe.dto.MailBody;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;



@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;


    public EmailService(JavaMailSender javaMailSender, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
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
            // Utilisez le constructeur prenant en charge le mode multipart
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Ajoutez l'image en tant que ressource intégrée
            ClassPathResource imageResource = new ClassPathResource("/static/images/logo.png");
            message.addInline("logo", imageResource);

            // Définissez les destinataires, l'expéditeur et le sujet de l'e-mail
            message.setTo(mailBody.to());
            message.setFrom("doghman.moetaz@gmail.com");
            message.setSubject(mailBody.subject());

            // Traitez le contenu HTML avec Thymeleaf et les variables de contexte fournies
            String htmlContent = templateEngine.process(templateName, context);

            // Définissez le contenu HTML avec l'image en ligne
            message.setText(htmlContent, true);

            // Envoyez l'e-mail
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Gérez l'exception
        }
    }

}
