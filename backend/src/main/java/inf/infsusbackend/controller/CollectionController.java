package inf.infsusbackend.controller;

import inf.infsusbackend.DTO.CollectionDto;
import inf.infsusbackend.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {
    private final CollectionService collectionService;

    @Autowired
    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public ResponseEntity<List<CollectionDto>> getCollections() {
        List<CollectionDto> collections = collectionService.getCollections();
        return ResponseEntity.ok(collections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionDto> getCollectionById(@PathVariable("id") Integer id) {
        CollectionDto collection = collectionService.getCollectionById(id);
        if (collection != null) {
            return ResponseEntity.ok(collection);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<CollectionDto> createCollection(@RequestBody CollectionDto collectionDto) {
        CollectionDto createdCollection = collectionService.createCollection(collectionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCollection);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollectionDto> updateCollection(@PathVariable("id") Integer id, @RequestBody CollectionDto collectionDto) {
        CollectionDto updatedCollection = collectionService.updateCollection(id, collectionDto);
        if (updatedCollection != null) {
            return ResponseEntity.ok(updatedCollection);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable("id") Integer id) {
        boolean deleted = collectionService.deleteCollection(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
