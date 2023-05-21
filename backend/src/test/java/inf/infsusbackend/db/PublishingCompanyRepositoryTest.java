package inf.infsusbackend.db;

import inf.infsusbackend.entity.PublishingCompany;
import inf.infsusbackend.repository.PublishingCompanyRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Sql(scripts = "start.sql")
public class PublishingCompanyRepositoryTest {

    @Autowired
    private PublishingCompanyRepository publishingCompanyRepository;

    @Test
    @Order(1)
    public void testFindAll() {
        List<PublishingCompany> publishingCompanyList = publishingCompanyRepository.findAll();
        Assertions.assertEquals("Test 1", publishingCompanyList.stream().findAny().get().getName());
    }

    @Test
    @Order(3)
    public void testFindByName() {
        List<PublishingCompany> publishingCompanies = publishingCompanyRepository.findByNameContaining("Test 1");
        Assertions.assertNotEquals(0, publishingCompanies.size());
    }

    @Test
    @Order(4)
    public void testCreateAndGetById() {
        PublishingCompany publishingCompany = new PublishingCompany();
        publishingCompany.setName("Test 4");
        PublishingCompany publishingCompany1 = publishingCompanyRepository.save(publishingCompany);
        Optional<PublishingCompany> publishingCompany2 = publishingCompanyRepository.findById(publishingCompany1.getId());
        assertThat(publishingCompany2.isPresent());
        Assertions.assertEquals(4, publishingCompanyRepository.findAll().size());
    }

    @Test
    @Order(5)
    public void testCreateAndUpdate() {
        PublishingCompany publishingCompany = new PublishingCompany();
        publishingCompany.setName("Test 5");
        PublishingCompany publishingCompany1 = publishingCompanyRepository.save(publishingCompany);
        publishingCompany1.setName("Test 5 Updated");
        PublishingCompany publishingCompany2 = publishingCompanyRepository.save(publishingCompany1);
        Assertions.assertEquals("Test 5 Updated", publishingCompany2.getName());
    }

    @Test
    @Order(6)
    public void testCreateAndDelete() {
        PublishingCompany publishingCompany = new PublishingCompany();
        publishingCompany.setName("Test 6");
        PublishingCompany publishingCompany1 = publishingCompanyRepository.save(publishingCompany);
        publishingCompanyRepository.deleteById(publishingCompany1.getId());
        Assertions.assertEquals(3, publishingCompanyRepository.findAll().size());
    }
}
