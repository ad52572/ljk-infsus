package inf.infsusbackend.repository;

import inf.infsusbackend.entity.PublishingCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublishingCompanyRepository extends JpaRepository<PublishingCompany, Integer> {
    List<PublishingCompany> findByNameContaining(String name);
}
