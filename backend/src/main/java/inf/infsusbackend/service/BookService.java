package inf.infsusbackend.service;

import inf.infsusbackend.DTO.BookDto;
import inf.infsusbackend.entity.Author;
import inf.infsusbackend.entity.Book;
import inf.infsusbackend.entity.PublishingCompany;
import inf.infsusbackend.repository.AuthorRepository;
import inf.infsusbackend.repository.BookRepository;
import inf.infsusbackend.repository.CollectionRepository;
import inf.infsusbackend.repository.PublishingCompanyRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final ModelMapper modelMapper;
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublishingCompanyRepository publishingCompanyRepository;
    private final CollectionRepository collectionRepository;

    @Autowired
    public BookService(ModelMapper modelMapper, BookRepository bookRepository, AuthorRepository authorRepository, PublishingCompanyRepository publishingCompanyRepository, CollectionService collectionService, CollectionRepository collectionRepository) {
        this.modelMapper = modelMapper;
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publishingCompanyRepository = publishingCompanyRepository;
        this.collectionRepository = collectionRepository;
    }

    //create CRUD for book
    public List<BookDto> getBooks() {
        return bookRepository.findAll().stream().map(book -> modelMapper.map(book, BookDto.class)).collect(Collectors.toList());
    }

    public BookDto getBookById(Integer id) {
        return modelMapper.map(bookRepository.getReferenceById(id), BookDto.class);
    }

    public BookDto createBook(BookDto bookDto) {
        return modelMapper.map(bookRepository.save(modelMapper.map(bookDto, Book.class)), BookDto.class);
    }

    public BookDto updateBook(Integer id, BookDto bookDto) {
        inf.infsusbackend.entity.Book book = bookRepository.getReferenceById(id);
        if (bookDto.getAuthorId() != null) {
            Author author = authorRepository.getReferenceById(bookDto.getAuthorId());
            book.setAuthor(author);
        }
        if (bookDto.getPublishingCompanyId() != null) {
            PublishingCompany publishingCompany = publishingCompanyRepository.getReferenceById(bookDto.getPublishingCompanyId());
            book.setPublishingCompany(publishingCompany);
        }
        if (bookDto.getCollectionId() != null) {
            inf.infsusbackend.entity.Collection collection = collectionRepository.getReferenceById(bookDto.getCollectionId());
            book.setCollection(collection);
        }

        book.setDescription(bookDto.getDescription() != null ? bookDto.getDescription() : book.getDescription());
        book.setPrice(bookDto.getPrice() != null ? bookDto.getPrice() : book.getPrice());
        book.setTitle(bookDto.getTitle() != null ? bookDto.getTitle() : book.getTitle());
        book.setPublicationDate(bookDto.getPublicationDate() != null ? bookDto.getPublicationDate() : book.getPublicationDate());
        return modelMapper.map(bookRepository.save(book), BookDto.class);
    }

    public boolean deleteBook(Integer id) {
        Optional<Book> book = bookRepository.findById(id);
        if (book.isPresent()) {
            bookRepository.delete(book.get());
            return true;
        } else {
            return false;
        }
    }

    public void deleteFromCollection(Integer id) {
        Book book =  bookRepository.getReferenceById(id);
        book.setCollection(null);
        bookRepository.save(book);
    }

    public List<BookDto> searchBook(String title) {
        return bookRepository.findByTitleContaining(title).stream().map(book -> modelMapper.map(book, BookDto.class)).collect(Collectors.toList());
    }
}
