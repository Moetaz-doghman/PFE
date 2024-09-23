package com.example.projectPfe.controllers;

import com.example.projectPfe.models.Role;
import com.example.projectPfe.models.Utilisateur;
import com.example.projectPfe.models.ERole;
import com.example.projectPfe.payload.request.LoginRequest;
import com.example.projectPfe.payload.request.SignupRequest;
import com.example.projectPfe.payload.response.JwtResponse;
import com.example.projectPfe.payload.response.MessageResponse;
import com.example.projectPfe.repository.RoleRepository;
import com.example.projectPfe.repository.UtilisateurRepository;
import com.example.projectPfe.security.jwt.JwtUtils;
import com.example.projectPfe.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UtilisateurRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (!userDetails.isActive()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("NotActive"));

        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getPassword(),
                userDetails.getUsername(),
                userDetails.getPrenom(),
                userDetails.getMatricule(),
                userDetails.getAdresse(),
                userDetails.getTel(),
                userDetails.getIdentiteBancaire(),
                userDetails.isActive(),
                roles));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Successfully logged out!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {


        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        Utilisateur user = new Utilisateur(
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_DENTIST)





                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));


            roles.add(userRole);

        } else {
            strRoles.forEach(role -> {

                switch (role) {

                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "opt":
                        Role optRole = roleRepository.findByName(ERole.ROLE_OPTICIEN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(optRole);

                        break;
                    case "dent":
                        Role dentRole = roleRepository.findByName(ERole.ROLE_DENTIST)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(dentRole);
                        break;
                    case "C_Dent":
                        Role C_DentRole = roleRepository.findByName(ERole.ROLE_DENTIST_CONTROLEUR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(C_DentRole);
                        break;

                    case "C_Opt":
                        Role C_OptRole = roleRepository.findByName(ERole.ROLE_OPTICIEN_CONTROLEUR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(C_OptRole);
                        break;

                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_DENTIST)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);

                } }) ; }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


}
