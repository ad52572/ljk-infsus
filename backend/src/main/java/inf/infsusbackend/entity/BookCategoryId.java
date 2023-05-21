package inf.infsusbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BookCategoryId implements Serializable {
    private static final long serialVersionUID = -2152835000950077636L;
    @Column(name = "book_id", nullable = false)
    private Integer bookId;
    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(categoryId, bookId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        BookCategoryId entity = (BookCategoryId) o;
        return Objects.equals(this.categoryId, entity.categoryId) &&
                Objects.equals(this.bookId, entity.bookId);
    }
}