package inf.infsusbackend.service;

import inf.infsusbackend.DTO.CollectionDto;
import inf.infsusbackend.entity.Collection;
import inf.infsusbackend.repository.AuthorRepository;
import inf.infsusbackend.repository.BookRepository;
import inf.infsusbackend.repository.CollectionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CollectionService {
    private final CollectionRepository collectionRepository;
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CollectionService(CollectionRepository collectionRepository, BookRepository bookRepository, AuthorRepository authorRepository, ModelMapper modelMapper) {
        this.collectionRepository = collectionRepository;
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.modelMapper = modelMapper;
    }

    public List<CollectionDto> getCollections() {
        return collectionRepository.findAll().stream().map(collection -> modelMapper.map(collection, CollectionDto.class)).collect(Collectors.toList());
    }

    public CollectionDto getCollectionById(Integer id) {
        return modelMapper.map(collectionRepository.getReferenceById(id), CollectionDto.class);
    }

    public CollectionDto createCollection(CollectionDto collectionDto) {
        return modelMapper.map(collectionRepository.save(modelMapper.map(collectionDto, inf.infsusbackend.entity.Collection.class)), CollectionDto.class);
    }

    public CollectionDto updateCollection(Integer id, CollectionDto collectionDto) {
        inf.infsusbackend.entity.Collection collection = collectionRepository.getReferenceById(id);
        if (collectionDto.getAuthor() != null) {
            collection.setAuthor(authorRepository.getReferenceById(collectionDto.getAuthor().getId()));
        }
        collection.setName(collectionDto.getName() != null ? collectionDto.getName() : collection.getName());
        return modelMapper.map(collectionRepository.save(collection), CollectionDto.class);
    }

    public boolean deleteCollection(Integer id) {
        Optional<Collection> collection = collectionRepository.findById(id);
        if (collection.isPresent()) {
            collectionRepository.delete(collection.get());
            return true;
        } else {
            return false;
        }
    }
}
