package inf.infsusbackend.DTO;

import inf.infsusbackend.validator.ValidOib;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class PublishingCompanyDto implements Serializable {
    private Integer id;
    private String name;
    @Size(min = 10, max = 100, message = "Description must be between 10 and 100 characters long")
    private String description;
    @PastOrPresent(message = "Founded date must be in the past or present")
    private Date founded;
    @ValidOib(message = "OIB format not valid")
    private String OIB;
}
