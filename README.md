# Mozilla IdP

``mozilla-idp`` is a server that implements support for Persona on the mozilla.com domain.

When deployed, this will allow mozillans with `mozilla.com` or `mozilla.org` email addresses
to authenticate with Persona enabled websites using their Mozilla (LDAP) password.

## Configuration

Note: This section is still in changing. 

### Step N: Creating Public/Private Keypairs

You will need a public and private key pair to act as a 
[Persona IdP](https://developer.mozilla.org/en-US/docs/Persona/Implementing_a_Persona_IdP). 

    > cd server/config
    > openssl genrsa -out private-key.pem 2048
    > openssl rsa -in private-key.pem -pubout > public-key.pem

### Step N: Creating a Configuration File 

    > cd server/config
    > cp local.json-dist local.json


## Deployment 

![Deployment Diagram](./docs/aws-infrastructure.png)

* Multi-Region, Multi availability zone deployment
* Use Route53 to DNS load balance across regions and manage region availability
* Use ELB to 
    * terminate SSL 
    * direct traffic to available hosts


