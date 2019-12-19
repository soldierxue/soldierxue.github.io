/**
 * 
 */
package spring.aws.s3;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.WritableResource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

/**
 * @author Administrator
 *
 */
@Service
public class S3ResouceLoader {
	@Value("${cloud.aws.s3.bucket}")
    private String bucket;
    
	@Autowired
	private ResourceLoader resourceLoader;
	public void resourceLoadingMethod() throws IOException {
		Resource resource = this.resourceLoader.getResource("s3://"+bucket+"/testRloader.log");
		
		//read file
		try{
			 InputStream is = resource.getInputStream();
	          BufferedReader br = new BufferedReader(new InputStreamReader(is));
              System.out.println("Begin to read test file:"+resource.getURI());
	          String line;
	          while ((line = br.readLine()) != null) {
	             System.out.println(line);
	       	  }
	          br.close();

	    	}catch(IOException e){
	    		e.printStackTrace();
	    	}	
	}
	
    public void writeResource() throws IOException {
        Resource resource = this.resourceLoader.getResource("s3://"+bucket+"/testRloader.log");
        WritableResource writableResource = (WritableResource) resource;
        try (OutputStream outputStream = writableResource.getOutputStream()) {
            outputStream.write("testddddrrrr".getBytes());
        }
    }
    
	@Autowired
 	private ResourcePatternResolver resourcePatternResolver;
 	public void resolveAndLoad() throws IOException {
 		String s3endpoint = "s3://"+bucket+"/";
 	    List<String> endpoints = Arrays.asList(s3endpoint+"**/*",s3endpoint+"*",s3endpoint+"**/");
 		for(String endpoint :endpoints){
 		    System.out.println("S3Endpoint:"+endpoint);
 		 	
 	 		Resource[] allFilesInBucket =  this.resourcePatternResolver.getResources(endpoint);
 	 		if(allFilesInBucket != null){
 	 			System.out.println("Numb#"+allFilesInBucket.length);
 	 	 		for(Resource r:allFilesInBucket){
 	 	 		}
 	 		}
 		}
 	}    
	
}
