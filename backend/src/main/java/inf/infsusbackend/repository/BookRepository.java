package inf.infsusbackend.repository;

import inf.infsusbackend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByTitleContaining(String title);

    List<Book> findByPublishingCompanyId(Integer publishingCompanyId);
}
