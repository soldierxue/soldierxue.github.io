package springboot.web;

@RestController
public class HelloWeb {
    @RequestMapping("/hello")
    public String index() {
        return "Hello World";
    }
}