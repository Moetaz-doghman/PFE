package com.example.projectPfe.repository;

import com.example.projectPfe.models.ERole;
import com.example.projectPfe.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);

    @Query("SELECT r FROM Role r WHERE r.name = :roleName")
    Role findName(@Param("roleName") ERole roleName);

}
