package inf.infsusbackend.entity;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "author")
@Getter
@Setter
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    private String f_name;
    private String l_name;
    private String email;
    private String phone;
    private Date b_day;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Collection> collections;

    @ManyToOne
    Organisation organisation;
}