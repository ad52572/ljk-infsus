package inf.infsusbackend.controller;

import inf.infsusbackend.DTO.PublishingCompanyDto;
import inf.infsusbackend.service.PublishingCompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/publishing-companies")
public class PublishingCompanyController {
    private final PublishingCompanyService publishingCompanyService;

    @Autowired
    public PublishingCompanyController(PublishingCompanyService publishingCompanyService) {
        this.publishingCompanyService = publishingCompanyService;
    }

    @GetMapping
    public ResponseEntity<List<PublishingCompanyDto>> getPublishingCompanies() {
        List<PublishingCompanyDto> companies = publishingCompanyService.getPublishingCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublishingCompanyDto> getPublishingCompanyById(@PathVariable("id") Integer id) {
        PublishingCompanyDto company = publishingCompanyService.getPublishingCompanyById(id);
        if (company != null) {
            return ResponseEntity.ok(company);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity createPublishingCompany(@Valid @RequestBody PublishingCompanyDto companyDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }
        PublishingCompanyDto createdCompany = publishingCompanyService.createPublishingCompany(companyDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
    }

    @PutMapping("/{id}")
    public ResponseEntity updatePublishingCompany(@PathVariable("id") Integer id, @Valid @RequestBody PublishingCompanyDto companyDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }
        PublishingCompanyDto updatedCompany = publishingCompanyService.updatePublishingCompany(id, companyDto);
        if (updatedCompany != null) {
            return ResponseEntity.ok(updatedCompany);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublishingCompany(@PathVariable("id") Integer id) {
        boolean deleted = publishingCompanyService.deletePublishingCompany(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<List<PublishingCompanyDto>> searchPublishingCompanyByName(@PathVariable("name") String name) {
        List<PublishingCompanyDto> companies = publishingCompanyService.searchPublishingCompanyByName(name);
        return ResponseEntity.ok(companies);
    }
}

