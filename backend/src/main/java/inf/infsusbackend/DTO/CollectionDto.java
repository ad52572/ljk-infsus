package inf.infsusbackend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class CollectionDto implements Serializable {
    private Integer id;
    private String name;
    private List<BookDto> books;
    private AuthorDto author;
}
