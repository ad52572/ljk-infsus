package inf.infsusbackend.DTO;

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
public class AuthorDto implements Serializable {
    private Integer id;
    private String f_name;
    private String l_name;
    private String email;
    private String phone;
    private Date b_day;
}
