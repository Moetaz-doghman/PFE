package com.example.projectPfe.Services.Interface;

import com.example.projectPfe.models.Bordereaux;
import com.example.projectPfe.models.EstatusBord;

import java.util.List;

public interface BordereauService {

    public Bordereaux genererBordereau(List<Integer> prestationsIds);

    public Bordereaux findById(int id);

    public List<Bordereaux> findAll();

    public List<Bordereaux> getBordereauxByUserId(int userId) ;

    public void deleteBordereauById(int bordereauId);

    public void changerStatutBordereau(int id, EstatusBord nouveauStatut) ;
}
