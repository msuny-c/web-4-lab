package ru.itmo.app.repository;

import java.util.List;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.itmo.app.model.PointModel;

@Stateless
public class PointsRepository {
    @PersistenceContext
    private EntityManager entityManager;
    public void save(PointModel pointModel) {
        entityManager.persist(pointModel);
    }
    public List<PointModel> getPointsByUsername(String username) {
        return entityManager.createQuery("SELECT p FROM PointModel p WHERE p.user.username = :username", PointModel.class)
                .setParameter("username", username)
                .getResultList();
    }
}
