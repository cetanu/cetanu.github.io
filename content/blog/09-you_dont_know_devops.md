+++
title = "You don't know what DevOps means"
description = "An exploration of the history of DevOps, how a cultural movement was rebranded into a job title, and why Platform Engineering is the course correction we needed."
date = 2026-07-30
slug = "you_dont_know_devops"
aliases = ["blog/2026-07-27-you_dont_know_devops"]
template = "article.html"
render = true

[taxonomies]
tags = ["devops"]

[extra]
go_to_top = true
+++

### What does empathy have to do with DevOps?
These days I see people throwing around the term DevOps in contexts that strike
me as odd.

Maybe the term has evolved to the point where I've been left behind, but I
think it's more likely that the term has been adopted by people who don't know
the history behind it.

Without knowing where it came from, what problem it was solving, how it did and
*did not* do that, and how it's changed over time, how can you be confident that
you know what it is?

I have to admit that while thinking about how to educate on this topic, I
started to approach my own ignorance, and after watching a [video from Jez
Humble from 8 years ago](https://www.youtube.com/watch?v=Y4H8dW7Ium8), I
realised that I don't have 10+ years of deep knowledge that I can distill into
bite size pieces to share.

If you want to know what DevOps is, I don't think you could find a better
explanation than from Jez. However, if you're interested in finding out how a
cultural shift in how we deliver software got transformed into a job title,
read on.

## In the Beginning there was a Wall
The cultural movement of DevOps started in 2009 after Patrick Debois coined the
term and hosted the first DevOpsDays conference. It was meant to be a
philosophy of shared responsibility, automation, and rapid feedback. The term
itself was meant to represent breaking down the silo between Dev and Ops, back
at a time where developers were prioritizing delivering software faster, while
operations were trying to keep everything stable. Two goals that conflicted.

{{ image(url="/img/wallofconfusion.jpg", no_hover=true) }}

At DevOpsDays, Paul Hammond from Flickr gave a talk titled "10+ Deploys Per
Day". This blew people's minds because at the time, enterprise software was
deployed a few times a year. People couldn't imagine deploying software 10
times in a single day without the entire system blowing up.

A couple years later, Amazon said they were deploying every 11.6 seconds. Big
tech were shipping features, doing experiments, and fixing bugs in minutes.
Traditional enterprise were terrified, because their process still involved
ticking items off a paper checklist with a pencil for their monthly deploys.

## Vendor Industrial Complex
Between 2010 and 2015 the hype train had left the station. Companies wanted the
speed that DevOps seemed to create.

Corporate leadership went looking for ways to implement it. They read tech
talks by the pioneers that said "We changed our culture, gave developers
autonomy, and built tools to support that way of working" but all they
remembered was the last bit.

Tech vendors were more than happy to sell them tools that promised to solve
what only a cultural change could.

Just like today how your fridge and toothbrush are "AI-Native", many software
tools started marketing that they could help achieve DevOps.

So instead of shared responsibility, empathy, autonomy across company
functions, and continuous feedback loops, they got Jenkins, Puppet, Docker,
Terraform, and YAML templates. Basically the McDonalds of DevOps.

## Painting the Silo a Different Color
{{ image(url="/img/newpaint.jpg", no_hover=true) }}

Companies thought they could just "buy" DevOps, so rather than training
developers to understand more about infrastructure, or teaching operations to
write code, they posted a job ad for DevOps Engineers.

Sysadmins were presented with the choice to stand by their principles, knowing
that DevOps was a culture, not a title, or they could accept a 40% pay bump and
work on the same problems with shinier tools.

## Google drops the Holy Grail
Just when everyone was bought into DevOps in 2016, "Site Reliability
Engineering: How Google Runs Production Systems" was released.

{{ image(url="/img/sre.png", alt="book cover of the SRE book", no_hover=true) }}

Google defined SRE as "what you get when you treat operations as if it's a
software problem." That line inspired me personally to start seeing the world
this way.

The principles of SRE were to eliminate toil through automation, measure system
reliability and attach service level objectives (SLOs) to it, and balance
velocity with stability through the use of error budgets, where you're
essentially permitted to make mistakes, as long as they were so few that a
customer couldn't tell the difference between internet weather and the site
having problems.

At that time, if you were a Google SRE, you were considered elite - the stack
of required skills to gain that title was a tall tower to climb.

An SRE was someone with the skillset of two types of engineers that had
previously been considered entirely separate tracks - infrastructure and
operations on the one hand, highly capable software developer on the other.
They were expected to be able to understand the same tech stack as the dev
team, and jump into the codebase to troubleshoot complex bugs in production.

In theory this was the DevOps dream, balancing velocity with stability. In
reality, the expectations were impossibly high.

What seemed to happen in business is that instead of encouraging and
cultivating that skillset, companies took their recent DevOps teams, rebranded
them to SREs, and made them handle the on-call for bugs caused by the dev team.

## Shifting into High Gear
Between 2015 and 2018, perhaps you can remember, there was much hype about
microservices and containers, and build tooling finally matured enough to run
tasks on every single commit. 

This laid the foundation for the "Shift Left" movement. Instead of throwing
code at testers, security, and operations, those responsibilities were moved
closer to where the code was written. This meant that automated tests,
vulnerability scans, and linting were happening before a merge was even
allowed. 

This enabled the idea that Werner Vogels from Amazon had laid out back in 2006
with his famous phrase: *"You build it, you run it."* Basically developers were
put on the hook for when their service blows up in production, creating a
natural incentive for them to write more reliable code.

{{ image(url="/img/ybyr.png", no_hover=true) }}

But as the story goes, we shifted left a bit too far. 

Developers were expected to write their own Terraform, set up reverse proxies
and database clusters, configure Kubernetes manifests, build their pipelines,
and set up alerts with Prometheus. Devs were left with barely enough time to
work on actual business logic.

## The Current Correction
Eventually, the industry realised (and is probably still realising) that you
can't just expect every dev to master every small piece of infra required to
run their business logic. You're not paying them to write YAML.

Thus the advent of **Platform Engineering**. The idea was to treat devs almost
like external customers, building out products internally that behave like
cloud components, providing "golden paths" to allow devs to move fast in
sanctioned ways.

So now, instead of a DevOps team setting up build pipelines, doing the
deployments for you, and handling your on-call - a platform team builds
self-service tooling and infrastructure with guardrails that developers can
deploy safely on their own.

When done correctly it reduces cognitive load while preserving developer
autonomy. It can be easy to **not** do this correctly and one example of that
would be if your platform has so many hoops to jump through that it's easier to
load up the AWS Console and set everything up through ClickOps.

The promise of the platform is that you own your code, and a path has been
paved for you so that you don't have to deal with setting up kubernetes, CICD,
monitoring, and other boilerplate.

## Conclusion

DevOps was **never** meant to be a job title, much less now in 2026 after we've
gone through so many cultural changes and big exchanges of ideas in the
industry leading to an evolution to the current state of platform engineering.

I think we're in a pretty good place right now, where a person with domain
expertise in a platform component like databases, proxies, or whatever else the
developer organization needs, can easily deliver value without having to be an
absolute expert in software engineering.

If your company is still on the lookout for DevOps engineers to make build
pipelines for the dev team, it might be time to pick up a few books, read some
articles, and examine the cultural blockages in your organisation.

If all else fails, you can tunnel-vision on one aspect of platform engineering
like kubernetes and do that for the next 5 years.

This blog started with the question, "What does empathy have to do with DevOps?"
Hopefully, you can now answer that yourself.
