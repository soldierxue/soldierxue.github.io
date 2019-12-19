/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.cloud.aws.sample.ec2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author Agim Emruli
 */
@Component
public class InstanceInfoBean {

    @Value("${ami-id:N/A}")
    private String amiId;

    @Value("${hostname:N/A}")
    private String hostname;

    @Value("${instance-type:N/A}")
    private String instanceType;

    @Value("${services/domain:N/A}")
    private String serviceDomain;


    public String getAmiId() {
        return this.amiId;
    }

    public String getHostname() {
        return this.hostname;
    }

    public String getInstanceType() {
        return this.instanceType;
    }

    public String getServiceDomain() {
        return this.serviceDomain;
    }
}

@Component
public class UserDataInforBean {

	@Value("${data1}")
	private String firstDataOption;

	@Value("${data2}")
	private String secondDataOption;
}

public class EC2TagsBean {
    
        @Value("#{instanceData.tag1}")
        private String value1;
    
        @Value("#{instanceData.tag2}")
        private String value2;
    
        @Value("#{instanceData.tag3}")
        private String value3;
    
        @Value("#{instanceData.tag4}")
        private String value4;
    }