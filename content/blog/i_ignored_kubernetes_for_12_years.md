+++
title = "For 12 years, I ignored Kubernetes"
description = "My journey from viewing Kubernetes as overcomplicated hype to understanding its true value in modern infrastructure."
date = 2026-06-30
template = "article.html"

[taxonomies]
tags = ["software", "infrastructure", "architecture", "devops", "kubernetes"]

[extra]
go_to_top = true
+++

# My introduction to Kubernetes

Like many people I heard about kubernetes because it was software from Google
that people were hyped about. I understood a little bit about it - it's a
container orchestrator, right?

I also heard about painful experiences that people had with it and I got this
impression that it was way too complicated for what it provided in most cases.

We've all heard the meme "I deployed my blog on kubernetes" as a classic
example of overengineering, and resume driven development when a team sets up
kubernetes for a single application.

While working in the industry, I was happy to let other people deal with this
perceived complexity. I was willing to let them work out all the problems and
figure out how to offer kubernetes to me as an end-user.

# Post-layoff

However, as time went on, it seemed that the entire industry made a decision to
adopt kubernetes, even if the overheads and complexity were of some cost,
because the cost was outweighed by standardisation.

Suddenly, every SRE / platform engineer role seemed to require knowledge of
kubernetes. It was never too clear how much knowledge or skill was required,
and there have been several interviews in which I've expressed that I don't
have any experience operating kubernetes (probably a bad thing to say in an
interview) and yet interviewers did not seem to be able to give me a picture of
how they use kubernetes and what I would need to know in order to sufficiently
operate their clusters/infrastructure.

# Start of the learning journey

So after being laid off in March 2026, it became apparent that learning
kubernetes would be a good idea. Later in May, when my video went viral and an
audience appeared with the desire to learn new things, particularly by being
taught by myself, it made even more sense to learn kubernetes because it would
give me the opportunity to both learn and teach at the same time.

So I embarked on a journey to learn kubernetes with the least amount of
patience possible, pressuring myself to learn it in a week. Over 7
live-streams, approximately 2-3 hours each, I gathered a decent picture of the
kubernetes landscape, a bit of history, and what tools people use to deploy and
manage kubernetes in modern times.

## 

The very first thing I did was started streaming on Twitch, with the stream
title "Added Kubernetes to my CV, now I have to learn it" and opened a browser,
went to the kubernetes website and started reading docs linearly. After going
through various concepts and basically trying to memorize them and failing, a
few chatters informed me of Kelsey Hightower's guide "Learning Kubernetes The
Hard Way".

I started going through this tutorial, and found that it required at
least 3 machines with 2GB of memory each, and I didn't have that hardware
laying around, and I didn't want to run them on my stream PC. So I signed up to
AWS and started to create EC2 instances manually, and SSHing onto them to set
up hostnames and run OpenSSL commands to do PKI.

At some point the tutorial was telling me to execute blobs of shell scripts and
I became enraged at the suggestion because it's been two decades since the
advent of configuration management, and at least a decade since kubernetes has
been released. So I thought that all this friction had already been smoothed out.

In hindsight, the entire purpose of Kelsey's guide is to expose someone to
these low-level concerns. However, I am personally more in favor of getting
something practical up and running quickly, and dealing with problems as they
arise.

So I started an argument with Gemini about Kelsey's guide, and it graciously
agreed that no sane engineer would set up kubernetes by following that guide in
a profession scenario. It led me to discover `kubeadm` which gave me a way to
bootstrap the cluster nodes in one command.

I used this newly found tool to then set all the infrastructure up with
Cloudformation, running the tool during the init of the EC2 instances via
UserData. I successfully got a cluster running and then tried to use Helm to
install "charts" to get a valheim server pod running.

Using helm got a bit messy, and a bunch of pods were crashing, and to be honest
I had no idea why. My hypothesis at the time was that the process of pushing
YAML to kube via helm and kubectl was fragile and that it was running into
issues with state becoming corrupted or partially deployed.

Finding myself frustrated, I took a break to think about what my next approach would be.

I had a friend tell me about his setup where he doesn't run any helm
commands against the cluster, but instead uses it to produce kubeconfigs as
build artifacts which are then ingested via GitOps.

I also started to remember a recommendation to use Talos Linux from another
peer so I decided to see what that was about. It sold this idea of an immutable
kubernetes cluster which supposedly would prevent the kind of state corruption
that I thought I was running into.

At this stage I decided to completely pivot, use Talos Linux, and switch to
Pulumi instead of Cloudformation for the infrastructure even though it would
cost me some time in the learning process.

I quite enjoyed Pulumi; it feels like a type-checked infrastructure, which is
cool. I used the golang SDK.

After a bunch of troubleshooting and looking at logs of pods, and feeding those
logs into Gemini, I discovered that there was a bootstrap dependency issue
where other pods like Argo required that AWS CCM was setup before it would work
properly.

After this, it was pretty smooth sailing. I could add CRDs and charts to my
gitrepo and argo would pick them up and provision pods quickly. I started to
thinkabout how to platformatize everything that I'd built but I realised that
thiscan become quite subjective, and so for this article I won't go into that
atall, but the options that I was aware of were tools like KubeVela,
Crossplane,and Backstage.

{% alert(warning=true) %}
Still writing this up
{% end %}

{{ youtube(id="V8iT_2YHtns") }}

<!--

< here is where I boil the entire article to its essence >

Two paths:

## Managed-k8s

* No-brainer
* Good for small scale
* EKS - Locked into AWS Bottlerocket
* GKE - ???
* AKS - ???

## Run-Your-Own-Cluster

* Don't want vendor lock-in
* Strong need for multi-cloud, especially mixed with baremetal
* 

---

# notes


* looked up docs on kubernetes.org

* kubernetes the hard way
- manually provisioning kube nodes with AWS
- hated it, wanted something more polished
- started asking LLMs about better ways

* discovered kubeadm
- started using cloudformation to provision the nodes
- created token on the control-plane via userdata script
- uploaded the token to AWS ParameterStore
- worker nodes pulled the token and joined cluster
- tried using Helm to provision pods and such

* discovered Talos linux
- Replaced the EC2s (Ubuntu) with Talos
- Rewrote the Cloudformation into Pulumi
- Used a Pulumi library to do the Talos bootstrapping
- Looots of troubleshooting
- Found that AWS CCM was a dependency of Argo
- Fixed the bootstrap, Argo working
- Started deploying pods
- Logged into Valheim game server as a test
- Made a cats server

* Started thinking about how to really platformatize kube
- found KubeVela
- learnt about the OAM (Open Application Model)
- refactored existing pods into OAM apps
- we are now here







---


Of course, it's obvious that people do this usually as an exercise to learn
kubernetes in whatever way they can, as did I with my recent adventure to
deploy a single valheim server.



At a kubernetes interview they may ask you about Operators and CRDs. Also there
is a question like "What exactly happens when you run kubectl apply -f
deployment.yaml"?

kubestronaut


short: what is the best piece of advice you've ever gotten?

video: recent experience with interviews
* coding portion
    - fundamental knowledge of DSA
    - methodical approach:
        * making a naive version first
        * addressing edge cases
        * optimizing performance
        * awareness of time/space complexity
        * communication the entire way through - justifying tradeoffs
* system design
    - requirements gathering to a professional degree
        * understand what the hiring company wants/needs
        -->

