package inf.infsusbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "publishing_company")
@Getter
@Setter
public class PublishingCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "publishingCompany", cascade = {CascadeType.PERSIST})
    private java.util.List<Book> books;

    private String description;
    private Date founded;
    private String OIB;

    @PreRemove
    private void removePublishingCompanyFromBooks() {
        for (Book book : books) {
            book.setPublishingCompany(null);
        }
    }
}