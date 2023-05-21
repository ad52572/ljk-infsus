package inf.infsusbackend.unit;

import inf.infsusbackend.DTO.BookDto;
import inf.infsusbackend.entity.Author;
import inf.infsusbackend.entity.Book;
import inf.infsusbackend.entity.PublishingCompany;
import inf.infsusbackend.repository.AuthorRepository;
import inf.infsusbackend.repository.BookRepository;
import inf.infsusbackend.repository.CollectionRepository;
import inf.infsusbackend.repository.PublishingCompanyRepository;
import inf.infsusbackend.service.BookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class BookServiceTest {

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private PublishingCompanyRepository publishingCompanyRepository;

    @Mock
    private CollectionRepository collectionRepository;

    @InjectMocks
    private BookService bookService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetBooks() {
        List<Book> books = new ArrayList<>();
        books.add(new Book());
        books.add(new Book());

        when(bookRepository.findAll()).thenReturn(books);
        when(modelMapper.map(any(Book.class), eq(BookDto.class))).thenReturn(new BookDto());

        List<BookDto> bookDtos = bookService.getBooks();

        assertEquals(2, bookDtos.size());
        verify(bookRepository, times(1)).findAll();
        verify(modelMapper, times(2)).map(any(Book.class), eq(BookDto.class));
    }

    @Test
    public void testGetBookById() {
        int bookId = 1;
        Book book = new Book();
        book.setId(bookId);
        BookDto bookDto = new BookDto();
        bookDto.setId(bookId);

        when(bookRepository.getReferenceById(bookId)).thenReturn(book);
        when(modelMapper.map(any(Book.class), eq(BookDto.class))).thenReturn(bookDto);

        BookDto returnedBookDto = bookService.getBookById(bookId);

        assertNotNull(returnedBookDto);
        assertEquals(bookId, returnedBookDto.getId());
        verify(bookRepository, times(1)).getReferenceById(bookId);
        verify(modelMapper, times(1)).map(any(Book.class), eq(BookDto.class));
    }

    @Test
    public void testCreateBook() {
        BookDto bookDto = new BookDto();
        bookDto.setTitle("Test Book");
        bookDto.setId(1);
        bookDto.setAuthorId(1);

        Author author = new Author();
        author.setId(1);
        when(authorRepository.getReferenceById(bookDto.getAuthorId())).thenReturn(author);

        Book savedBook = new Book();
        savedBook.setId(1);
        when(bookRepository.save(any(Book.class))).thenReturn(savedBook);

        when(modelMapper.map(any(Book.class), eq(BookDto.class))).thenReturn(bookDto);
        when(modelMapper.map(any(BookDto.class), eq(Book.class))).thenReturn(savedBook);

        BookDto createdBook = bookService.createBook(bookDto);

        assertNotNull(createdBook);
        assertEquals(savedBook.getId(), createdBook.getId());
        assertEquals(bookDto.getTitle(), createdBook.getTitle());
        assertEquals(bookDto.getAuthorId(), createdBook.getAuthorId());

        verify(bookRepository, times(1)).save(any(Book.class));
        verify(modelMapper, times(1)).map(any(Book.class), eq(BookDto.class));
    }

    @Test
    public void testUpdateBook() {
        int bookId = 1;

        BookDto bookDto = new BookDto();
        bookDto.setTitle("Updated Book");
        bookDto.setId(bookId);
        bookDto.setAuthorId(1);

        Book existingBook = new Book();
        existingBook.setId(bookId);
        existingBook.setTitle("Old Book");


        when(bookRepository.getReferenceById(bookId)).thenReturn(existingBook);
        when(authorRepository.getReferenceById(bookDto.getAuthorId())).thenReturn(existingBook.getAuthor());
        when(bookRepository.save(any(Book.class))).thenReturn(existingBook);

        when(modelMapper.map(any(Book.class), eq(BookDto.class))).thenReturn(bookDto);

        BookDto updatedBook = bookService.updateBook(bookId, bookDto);

        assertNotNull(updatedBook);
        assertEquals(bookId, updatedBook.getId());
        assertEquals(bookDto.getTitle(), updatedBook.getTitle());
        assertEquals(bookDto.getAuthorId(), updatedBook.getAuthorId());

        verify(bookRepository, times(1)).getReferenceById(bookId);
        verify(authorRepository, times(1)).getReferenceById(bookDto.getAuthorId());
        verify(bookRepository, times(1)).save(any(Book.class));
        verify(modelMapper, times(1)).map(any(Book.class), eq(BookDto.class));
    }

    @Test
    public void testDeleteBook_ExistingBook_ReturnsTrue() {
        int bookId = 1;
        Book existingBook = new Book();
        existingBook.setId(bookId);

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(existingBook));

        boolean result = bookService.deleteBook(bookId);

        assertTrue(result);
        verify(bookRepository, times(1)).findById(bookId);
        verify(bookRepository, times(1)).delete(existingBook);
    }

    @Test
    public void testDeleteBook_NonExistingBook_ReturnsFalse() {
        int bookId = 1;

        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        boolean result = bookService.deleteBook(bookId);

        assertFalse(result);
        verify(bookRepository, times(1)).findById(bookId);
        verify(bookRepository, never()).delete(any(Book.class));
    }

    @Test
    public void testDeleteFromCollection() {
        int bookId = 1;
        Book book = new Book();
        book.setId(bookId);

        when(bookRepository.getReferenceById(bookId)).thenReturn(book);
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        bookService.deleteFromCollection(bookId);

        assertNull(book.getCollection());
        verify(bookRepository, times(1)).getReferenceById(bookId);
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    public void testSearchBook() {
        String title = "Java";
        List<Book> books = new ArrayList<>();
        books.add(new Book());
        books.add(new Book());

        when(bookRepository.findByTitleContaining(title)).thenReturn(books);
        when(modelMapper.map(any(Book.class), eq(BookDto.class))).thenReturn(new BookDto());

        List<BookDto> bookDtos = bookService.searchBook(title);

        assertEquals(2, bookDtos.size());
        verify(bookRepository, times(1)).findByTitleContaining(title);
        verify(modelMapper, times(2)).map(any(Book.class), eq(BookDto.class));
    }

}

