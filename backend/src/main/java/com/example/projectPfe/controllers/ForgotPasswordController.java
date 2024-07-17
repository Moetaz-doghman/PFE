package com.example.projectPfe.controllers;

import com.example.projectPfe.Services.EmailService;
import com.example.projectPfe.dto.MailBody;
import com.example.projectPfe.models.ForgotPassword;
import com.example.projectPfe.models.Utilisateur;
import com.example.projectPfe.repository.ForgotPasswordRepostitory;
import com.example.projectPfe.repository.UserRepository;
import com.example.projectPfe.utils.ChangePassword;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Random;

@RestController
@RequestMapping("/forgotPassword")

public class ForgotPasswordController {

    private final UserRepository userRepository ;
    private final EmailService emailService ;

    private final PasswordEncoder passwordEncoder;



    private final ForgotPasswordRepostitory forgotPasswordRepostitory ;

    public ForgotPasswordController(UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder, ForgotPasswordRepostitory forgotPasswordRepostitory) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.forgotPasswordRepostitory = forgotPasswordRepostitory;
    }

    @GetMapping("/message")
    public String getMessage() {
        return "Ceci est un message de test";
    }

    // send mail for email Verif
    @PostMapping("/VerifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email)
    {
        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email "));

        int otp= otpGeneratior();

        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("this is the OTP for yout forgot password request ")
                .subject("OTP for Forgot password request :" +otp   )
                .build();
        ForgotPassword fp = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 70 * 1000 ))
                .user(user)
                .build();

        emailService.sendSimpleMessage(mailBody);
        forgotPasswordRepostitory.save(fp);

        return ResponseEntity.ok("");


    }

    @PostMapping("/send-html-email/{email}")
    public ResponseEntity<String> sendHtmlEmail(@PathVariable String email) {
        Context context = new Context();

        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email "));

        int otp= otpGeneratior();

        Date currentDate = new Date();
        context.setVariable("currentDate", currentDate);

        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("Ceci est le code OTP pour votre demande de réinitialisation de mot de passe : " + otp)
                .subject("Code OTP pour la demande de réinitialisation de mot de passe : " + otp)
                .build();

        ForgotPassword fp = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 70 * 1000 ))
                .user(user)
                .build();

        context.setVariable("name", user.getNom());
        context.setVariable("otp", otp);

        emailService.sendEmailWithHtmlTemplate(mailBody, "email-template", context);
        forgotPasswordRepostitory.save(fp);

        return ResponseEntity.ok("");

    }


    private Integer otpGeneratior(){
        Random random = new Random( );
        return random.nextInt(100_000 , 999_999);
    }

    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<String > verifyOtp(@PathVariable Integer otp , @PathVariable String email)
    {

        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valdi email "));

        ForgotPassword fp = forgotPasswordRepostitory.findByOtpAndUser(otp,user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email" + email));

        if(fp.getExpirationTime().before(Date.from(Instant.now()))){
            forgotPasswordRepostitory.deleteById(fp.getFpid());
            return new ResponseEntity<>("OTP has expired!" , HttpStatus.EXPECTATION_FAILED);

        }

        return ResponseEntity.ok("");
    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePassword(@RequestBody ChangePassword changePassword, @PathVariable String email)
    {
        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valdi email "));

        ForgotPassword fp = forgotPasswordRepostitory.findByUser(user) ;

        if(fp == null)
        {
         throw new RuntimeException("erreur.");
        }

        if(!Objects.equals(changePassword.password() , changePassword.repeatPassword()))
        {
            return  new ResponseEntity<>("Please enter the password again!" , HttpStatus.EXPECTATION_FAILED);
        }

        String encryptedPassword = passwordEncoder.encode(changePassword.password());
        userRepository.updatePassword(email, encryptedPassword);
        forgotPasswordRepostitory.deleteById(fp.getFpid());

        return ResponseEntity.ok("");

    }





}