package inf.infsusbackend.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CollectionControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    public void findAllCollections() throws Exception {
        mockMvc.perform(get("/collections"))
                .andExpect(status().isOk());
    }

    @Test
    public void findCollectionById() throws Exception {
        mockMvc.perform(get("/collections/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void findCollectionByIdNotFound() throws Exception {
        mockMvc.perform(get("/collections/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void createGetAndDeleteCollection() throws Exception {
        String json = "{\"name\":\"Test 1\"}";
        MvcResult result = mockMvc.perform(post("/collections")
                        .contentType("application/json")
                        .content(json))
                .andExpect(status().isCreated()).andReturn();
        String redirectUrl = result.getResponse().getRedirectedUrl();


        String urlTemplate = "/collections/" + redirectUrl.substring(redirectUrl.lastIndexOf("/") + 1);
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk());
        mockMvc.perform(delete(urlTemplate))
                .andExpect(status().is2xxSuccessful());
    }

}