package ru.itmo.app.repository;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ru.itmo.app.model.UserModel;

@Stateless
public class UserRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public void save(UserModel userModel) {
        entityManager.persist(userModel);
    }
    public UserModel findByUsername(String username) {
        return entityManager.createQuery("SELECT u FROM UserModel u WHERE u.username = :username", UserModel.class)
                .setParameter("username", username)
                .getResultList().stream().findFirst().orElse(null);
    }

    public boolean existsByUsername(String username) {
        return entityManager.createQuery("SELECT COUNT(*) FROM UserModel u WHERE u.username = :username", Long.class)
                .setParameter("username", username)
                .getResultList().stream().findFirst().orElse(0L) > 0;
    }
}
