package inf.infsusbackend.service;

import inf.infsusbackend.DTO.PublishingCompanyDto;
import inf.infsusbackend.entity.PublishingCompany;
import inf.infsusbackend.repository.PublishingCompanyRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PublishingCompanyService {

    private final PublishingCompanyRepository publishingCompanyRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public PublishingCompanyService(PublishingCompanyRepository publishingCompanyRepository, ModelMapper modelMapper) {
        this.publishingCompanyRepository = publishingCompanyRepository;
        this.modelMapper = modelMapper;
    }


    public List<PublishingCompanyDto> getPublishingCompanies() {
        return publishingCompanyRepository.findAll().stream().map(publishingCompany -> modelMapper.map(publishingCompany, PublishingCompanyDto.class)).collect(Collectors.toList());
    }

    public PublishingCompanyDto getPublishingCompanyById(Integer id) {
        return modelMapper.map(publishingCompanyRepository.getReferenceById(id), PublishingCompanyDto.class);
    }

    public PublishingCompanyDto createPublishingCompany(PublishingCompanyDto companyDto) {
        return modelMapper.map(publishingCompanyRepository.save(modelMapper.map(companyDto, inf.infsusbackend.entity.PublishingCompany.class)), PublishingCompanyDto.class);
    }

    public PublishingCompanyDto updatePublishingCompany(Integer id, PublishingCompanyDto companyDto) {
        Optional<PublishingCompany> company = publishingCompanyRepository.findById(id);
        PublishingCompany saveCompany;
        if (company.isEmpty()) {
            saveCompany = new PublishingCompany();
        } else {
            saveCompany = company.get();
        }

        saveCompany.setName(companyDto.getName() != null ? companyDto.getName() : saveCompany.getName());
        saveCompany.setDescription(companyDto.getDescription() != null ? companyDto.getDescription() : saveCompany.getDescription());
        saveCompany.setFounded(companyDto.getFounded() != null ? companyDto.getFounded() : saveCompany.getFounded());
        saveCompany.setOIB(companyDto.getOIB() != null ? companyDto.getOIB() : saveCompany.getOIB());
        return modelMapper.map(publishingCompanyRepository.save(saveCompany), PublishingCompanyDto.class);
    }

    public boolean deletePublishingCompany(Integer id) {
        Optional<PublishingCompany> company = publishingCompanyRepository.findById(id);
        if (company.isEmpty()) {
            return false;
        } else {
            publishingCompanyRepository.delete(company.get());
            return true;
        }
    }

    public List<PublishingCompanyDto> searchPublishingCompanyByName(String name) {
        return publishingCompanyRepository.findByNameContaining(name).stream().map(publishingCompany -> modelMapper.map(publishingCompany, PublishingCompanyDto.class)).collect(Collectors.toList());
    }
}
