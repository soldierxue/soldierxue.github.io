package springboot.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWeb {
    @RequestMapping("/hello")
    public String index() {
        return "Hello World";
    }
}
