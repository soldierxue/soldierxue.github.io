package org.soldierxue.s3;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.util.List;

import com.amazonaws.auth.*;
import com.amazonaws.auth.profile.*;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.regions.ServiceAbbreviations;
//import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.amazonaws.services.s3.model.*;

/**
 * Hello world!
 *
 */
public class App 
{
    private static final String SUFFIX = "/";
    private static final String regionName ="cn-north-1";
    private static final String bucketName ="awshare";//change to your bucket

    public static void main( String[] args )
    {
     // AmazonS3 s3Client = new AmazonS3Client();
    //   AmazonS3 s3client = new AmazonS3Client(new DefaultAWSCredentialsProviderChain());
      AmazonS3 s3client = new AmazonS3Client(new ProfileCredentialsProvider("bjs"));
      Region region = Region.getRegion(Regions.fromName(regionName));
      s3client.setRegion(region);
      final String serviceEndpoint = region.getServiceEndpoint(ServiceAbbreviations.S3);
      // 关键是下面这一行, 在除了中国外的其他region, 这行代码不用写
      s3client.setEndpoint(serviceEndpoint);
      System.out.println("setting s3 region: " + region + ", : " + serviceEndpoint);
        System.out.println( "Hello World!" );
    
        // /* list bucket */
        System.out.println("List buckets:");
        for (Bucket bucket : s3client.listBuckets()) {
             System.out.println(" - " + bucket.getName());
        }
        /* List objects for specific bucket*/
        System.out.println("List objects for bucket #"+bucketName);
        ObjectListing objListing = s3client.listObjects(bucketName);

        for(S3ObjectSummary s3obj:objListing.getObjectSummaries()){
            System.out.println(s3obj.getKey()+" ,"+s3obj.getOwner()+" ,"+s3obj.getSize());
        }
          
    }
}
