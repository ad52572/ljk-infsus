package inf.infsusbackend.service;

import inf.infsusbackend.DTO.AuthorDto;
import inf.infsusbackend.repository.AuthorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorService {

    private final ModelMapper modelMapper;
    private final AuthorRepository authorRepository;

    @Autowired
    public AuthorService(ModelMapper modelMapper, AuthorRepository authorRepository) {
        this.modelMapper = modelMapper;
        this.authorRepository = authorRepository;

    }

    public List<AuthorDto> getAuthors() {
        return authorRepository.findAll().stream().map(authors -> modelMapper.map(authors, AuthorDto.class)).collect(Collectors.toList());
    }

}
