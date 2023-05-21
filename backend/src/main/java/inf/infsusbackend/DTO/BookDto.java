package inf.infsusbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class BookDto implements Serializable {
    private Integer id;
    private String title;
    private LocalDate publicationDate;
    private String description;
    private Double price;
    private Integer publishingCompanyId;
    private Integer authorId;
    private Integer collectionId;
}
