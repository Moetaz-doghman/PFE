package com.example.projectPfe.Services;

import com.example.projectPfe.Exceptions.EmailAlreadyExistsException;
import com.example.projectPfe.Exceptions.UserNotFoundException;
import com.example.projectPfe.Services.Interface.UserService;
import com.example.projectPfe.dto.MailBody;
import com.example.projectPfe.models.ChangePasswordRequest;
import com.example.projectPfe.models.ERole;
import com.example.projectPfe.models.Role;
import com.example.projectPfe.models.Utilisateur;
import com.example.projectPfe.repository.RoleRepository;
import com.example.projectPfe.repository.UtilisateurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UtilisateurRepository userRepository;
    private final RoleRepository roleRepository;
    private final JavaMailSender emailSender;
    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService ;


    @Override
    public Utilisateur ajouterCompte(Utilisateur user , ERole roleName) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("L'email spécifié est déjà utilisé par un autre utilisateur.");
        }

        Role role = roleRepository.findByName(ERole.valueOf(String.valueOf(roleName)))
                .orElseThrow(() -> new UserNotFoundException("Le rôle spécifié n'existe pas."));

        Context context = new Context();

        user.getRoles().add(role);
        user.activerCompte();
        Utilisateur savedUser = userRepository.save(user);
      //  sendAccountDetailsEmail(savedUser.getEmail(), savedUser.getPassword());

        // Ajoutez la date actuelle au contexte
        Date currentDate = new Date();
        context.setVariable("currentDate", currentDate);

        MailBody mailBody = MailBody.builder()
                .to(savedUser.getEmail())
                .subject("Détails de votre compte " )
                .build();

        context.setVariable("name", savedUser.getNom());
        context.setVariable("email" , savedUser.getEmail());
        context.setVariable("mdp" , savedUser.getPassword());

        emailService.sendEmailWithHtmlTemplate(mailBody, "template", context);


        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

         savedUser = userRepository.save(user);


        return savedUser;
    }

    public Optional<Utilisateur> findUserById(int userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Utilisateur modifierUtilisateur(int id, Utilisateur user) {
        Utilisateur utilisateur  =userRepository.findById(id).orElse(null);

        if (userRepository.existsById(id)) {
            utilisateur.setNom(user.getNom());
            utilisateur.setPrenom(user.getPrenom());
            utilisateur.setAdresse(user.getAdresse());
            utilisateur.setTel(user.getTel());
            utilisateur.setIdentiteBancaire(user.getIdentiteBancaire());
            return userRepository.save(utilisateur);
        } else {
            throw new RuntimeException("Assurance not found with id: " + id);
        }
    }

    @Override
    public void changePassword(int userId, String newPassword) {

            Utilisateur user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
            user.setPassword(newPassword);
            userRepository.save(user);

    }

    @Override
    public boolean changePassword(int userId, ChangePasswordRequest request) {
        Utilisateur user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return true;





    }


    @Override
    public Utilisateur desactiverCompte(int userId) {
        Utilisateur user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + userId));

        user.desactiverCompte();

        return userRepository.save(user);
    }

    @Override
    public Utilisateur activerCompte(int userId) {
        Utilisateur user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé avec l'ID : " + userId));

        user.activerCompte();

        return userRepository.save(user);    }

    @Override
    public boolean SupprimerUser(int userId) {
        boolean exist = userRepository.existsById(userId);

        if (!exist) {
            return false ;
        }

        else {
            userRepository.deleteById(userId);
            return true ;

        }
    }

    @Override
    public List<Utilisateur> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<Utilisateur> getAllusersNotAdmin() {
        return userRepository.findAllExceptAdmins();
    }


    private void sendAccountDetailsEmail(String recipientEmail, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("hbaieb.houssem999@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("Your Account Details");
        message.setText("Your account has been successfully created.\n"
                + "Email: " + recipientEmail + "\n"
                + "Password: " + password);
        emailSender.send(message);
    }


    }

